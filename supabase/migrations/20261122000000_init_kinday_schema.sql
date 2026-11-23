-- =============================================================================
-- kinDay Database Migration: Complete Schema & Row Level Security (RLS)
-- Version: 1.0 (MVP)
-- Namespace: kd_ (Isolated in shared Supabase project)
-- Target: Supabase / PostgreSQL 15+
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. Enums
-- -----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE kd_member_role AS ENUM ('parent', 'guardian');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE kd_routine_time_of_day AS ENUM ('morning', 'afternoon', 'evening', 'anytime');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE kd_completion_status AS ENUM ('to_do', 'waiting_approval', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE kd_star_transaction_type AS ENUM ('routine_earned', 'reward_redeemed', 'parent_adjustment');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE kd_event_kind AS ENUM ('school', 'homework', 'fee', 'activity', 'other');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE kd_event_source AS ENUM ('manual', 'ai_circular');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE kd_circular_scan_status AS ENUM ('uploading', 'processing', 'ready_for_review', 'confirmed', 'discarded', 'failed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE kd_journal_label AS ENUM ('first_steps', 'first_words', 'new_skill', 'lost_tooth', 'first_day_of_school', 'other');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- -----------------------------------------------------------------------------
-- 2. Families & Members
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.kd_families (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    timezone TEXT NOT NULL DEFAULT 'UTC',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.kd_family_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.kd_families(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role kd_member_role NOT NULL DEFAULT 'parent',
    parent_pin_hash TEXT,
    consent_policy_version TEXT NOT NULL,
    consent_timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_kd_family_user UNIQUE (family_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_kd_family_members_user ON public.kd_family_members(user_id);
CREATE INDEX IF NOT EXISTS idx_kd_family_members_family ON public.kd_family_members(family_id);

-- -----------------------------------------------------------------------------
-- 3. Children Profiles
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.kd_children (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.kd_families(id) ON DELETE CASCADE,
    nickname TEXT NOT NULL,
    avatar_preset TEXT NOT NULL,
    birth_month INT NOT NULL CHECK (birth_month BETWEEN 1 AND 12),
    birth_year INT NOT NULL,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kd_children_family ON public.kd_children(family_id);

CREATE OR REPLACE FUNCTION public.kd_get_child_age_band(p_birth_year INT, p_birth_month INT)
RETURNS TEXT AS $$
DECLARE
    current_yr INT := EXTRACT(YEAR FROM CURRENT_DATE);
    current_mo INT := EXTRACT(MONTH FROM CURRENT_DATE);
    age_in_months INT;
    age_in_years INT;
BEGIN
    age_in_months := (current_yr - p_birth_year) * 12 + (current_mo - p_birth_month);
    age_in_years := age_in_months / 12;

    IF age_in_years < 1 THEN
        RETURN 'under_age';
    ELSIF age_in_years BETWEEN 1 AND 3 THEN
        RETURN 'toddler_1_to_3';
    ELSIF age_in_years BETWEEN 4 AND 6 THEN
        RETURN 'kid_4_to_6';
    ELSIF age_in_years BETWEEN 7 AND 10 THEN
        RETURN 'kid_7_to_10';
    ELSE
        RETURN 'over_10';
    END IF;
END;
$$ LANGUAGE plpgsql STABLE;

-- -----------------------------------------------------------------------------
-- 4. Kid Devices & Pairing Codes
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.kd_kid_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES public.kd_children(id) ON DELETE CASCADE,
    device_token_hash TEXT NOT NULL UNIQUE,
    device_name TEXT NOT NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT false,
    last_sync_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kd_kid_devices_child ON public.kd_kid_devices(child_id);

CREATE TABLE IF NOT EXISTS public.kd_pairing_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES public.kd_children(id) ON DELETE CASCADE,
    code_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kd_pairing_codes_lookup ON public.kd_pairing_codes(code_hash) WHERE is_used = false;

-- -----------------------------------------------------------------------------
-- 5. Routines & Completions
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.kd_routines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES public.kd_children(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    icon_preset TEXT NOT NULL,
    time_of_day kd_routine_time_of_day NOT NULL DEFAULT 'anytime',
    exact_time TIME,
    days_of_week INT[] NOT NULL DEFAULT '{1,2,3,4,5,6,7}',
    star_value INT NOT NULL CHECK (star_value BETWEEN 1 AND 5),
    needs_approval BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kd_routines_child ON public.kd_routines(child_id);

CREATE TABLE IF NOT EXISTS public.kd_routine_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    routine_id UUID NOT NULL REFERENCES public.kd_routines(id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES public.kd_children(id) ON DELETE CASCADE,
    completion_date DATE NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    status kd_completion_status NOT NULL DEFAULT 'waiting_approval',
    rejection_reason TEXT,
    star_credited BOOLEAN NOT NULL DEFAULT false,
    client_idempotency_key TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_kd_daily_completion UNIQUE (routine_id, completion_date),
    CONSTRAINT unique_kd_idempotency_key UNIQUE (client_idempotency_key)
);

CREATE INDEX IF NOT EXISTS idx_kd_completions_child_date ON public.kd_routine_completions(child_id, completion_date);

-- -----------------------------------------------------------------------------
-- 6. Rewards & Star Ledger
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.kd_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.kd_families(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    star_cost INT NOT NULL CHECK (star_cost > 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kd_rewards_family ON public.kd_rewards(family_id);

CREATE TABLE IF NOT EXISTS public.kd_star_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES public.kd_children(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    balance_after INT NOT NULL CHECK (balance_after >= 0),
    transaction_type kd_star_transaction_type NOT NULL,
    reference_id UUID,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kd_star_ledger_child ON public.kd_star_ledger(child_id, created_at DESC);

-- -----------------------------------------------------------------------------
-- 7. Circular Scans
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.kd_circular_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.kd_families(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES auth.users(id),
    storage_path TEXT NOT NULL,
    status kd_circular_scan_status NOT NULL DEFAULT 'uploading',
    page_count INT NOT NULL DEFAULT 1 CHECK (page_count <= 5),
    raw_extracted_json JSONB,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days')
);

CREATE INDEX IF NOT EXISTS idx_kd_circular_scans_family ON public.kd_circular_scans(family_id);

-- -----------------------------------------------------------------------------
-- 8. Calendar Events
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.kd_calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.kd_families(id) ON DELETE CASCADE,
    child_id UUID REFERENCES public.kd_children(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    is_all_day BOOLEAN NOT NULL DEFAULT false,
    kind kd_event_kind NOT NULL DEFAULT 'school',
    source kd_event_source NOT NULL DEFAULT 'manual',
    circular_scan_id UUID REFERENCES public.kd_circular_scans(id) ON DELETE SET NULL,
    reminder_minutes_before INT DEFAULT 60,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kd_calendar_events_family ON public.kd_calendar_events(family_id, start_time);
CREATE INDEX IF NOT EXISTS idx_kd_calendar_events_child ON public.kd_calendar_events(child_id);

-- -----------------------------------------------------------------------------
-- 9. Journal Entries, Activity Cards, & Starter Templates
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.kd_journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES public.kd_children(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    note TEXT NOT NULL CHECK (char_length(note) <= 2000),
    photo_storage_path TEXT,
    label kd_journal_label NOT NULL DEFAULT 'other',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kd_journal_entries_child ON public.kd_journal_entries(child_id, entry_date DESC);

CREATE TABLE IF NOT EXISTS public.kd_activity_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    min_age_months INT NOT NULL DEFAULT 12,
    max_age_months INT NOT NULL DEFAULT 36,
    description TEXT NOT NULL,
    materials TEXT,
    is_curated BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.kd_routine_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    age_band TEXT NOT NULL,
    title TEXT NOT NULL,
    icon_preset TEXT NOT NULL,
    time_of_day kd_routine_time_of_day NOT NULL,
    default_star_value INT NOT NULL DEFAULT 1,
    needs_approval BOOLEAN NOT NULL DEFAULT true
);

-- -----------------------------------------------------------------------------
-- 10. Row Level Security Helper Functions
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.kd_is_family_member(p_family_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.kd_family_members
        WHERE family_id = p_family_id AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.kd_can_access_child(p_child_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.kd_children c
        JOIN public.kd_family_members fm ON fm.family_id = c.family_id
        WHERE c.id = p_child_id AND fm.user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- -----------------------------------------------------------------------------
-- 11. Enable Row Level Security (RLS)
-- -----------------------------------------------------------------------------
ALTER TABLE public.kd_families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kd_family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kd_children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kd_kid_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kd_pairing_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kd_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kd_routine_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kd_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kd_star_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kd_circular_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kd_calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kd_journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kd_activity_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kd_routine_templates ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 12. Security Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "kd_families_access" ON public.kd_families FOR ALL USING (public.kd_is_family_member(id));
CREATE POLICY "kd_family_members_select" ON public.kd_family_members FOR SELECT USING (public.kd_is_family_member(family_id));
CREATE POLICY "kd_family_members_all" ON public.kd_family_members FOR ALL USING (user_id = auth.uid());
CREATE POLICY "kd_children_access" ON public.kd_children FOR ALL USING (public.kd_is_family_member(family_id));
CREATE POLICY "kd_routines_access" ON public.kd_routines FOR ALL USING (public.kd_can_access_child(child_id));
CREATE POLICY "kd_completions_access" ON public.kd_routine_completions FOR ALL USING (public.kd_can_access_child(child_id));
CREATE POLICY "kd_rewards_access" ON public.kd_rewards FOR ALL USING (public.kd_is_family_member(family_id));
CREATE POLICY "kd_ledger_access" ON public.kd_star_ledger FOR ALL USING (public.kd_can_access_child(child_id));
CREATE POLICY "kd_scans_access" ON public.kd_circular_scans FOR ALL USING (public.kd_is_family_member(family_id));
CREATE POLICY "kd_events_access" ON public.kd_calendar_events FOR ALL USING (public.kd_is_family_member(family_id));
CREATE POLICY "kd_journal_access" ON public.kd_journal_entries FOR ALL USING (public.kd_can_access_child(child_id));
CREATE POLICY "kd_cards_select" ON public.kd_activity_cards FOR SELECT TO authenticated USING (is_curated = true);
CREATE POLICY "kd_cards_anon_select" ON public.kd_activity_cards FOR SELECT TO anon USING (is_curated = true);
CREATE POLICY "kd_templates_select" ON public.kd_routine_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "kd_templates_anon_select" ON public.kd_routine_templates FOR SELECT TO anon USING (true);

-- -----------------------------------------------------------------------------
-- 13. Atomic Routine Approval & Star Credit
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.kd_approve_routine_completion(
    p_completion_id UUID,
    p_approver_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_completion RECORD;
    v_routine RECORD;
    v_current_balance INT := 0;
    v_new_balance INT := 0;
BEGIN
    SELECT * INTO v_completion FROM public.kd_routine_completions
    WHERE id = p_completion_id FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Completion not found';
    END IF;

    IF v_completion.star_credited THEN
        RETURN jsonb_build_object('success', false, 'message', 'Stars already credited');
    END IF;

    SELECT * INTO v_routine FROM public.kd_routines
    WHERE id = v_completion.routine_id;

    SELECT COALESCE(balance_after, 0) INTO v_current_balance
    FROM public.kd_star_ledger
    WHERE child_id = v_completion.child_id
    ORDER BY created_at DESC LIMIT 1;

    v_new_balance := COALESCE(v_current_balance, 0) + v_routine.star_value;

    INSERT INTO public.kd_star_ledger (
        child_id,
        amount,
        balance_after,
        transaction_type,
        reference_id,
        note
    ) VALUES (
        v_completion.child_id,
        v_routine.star_value,
        v_new_balance,
        'routine_earned',
        v_completion.id,
        'Approved completion: ' || v_routine.title
    );

    UPDATE public.kd_routine_completions
    SET status = 'approved',
        star_credited = true
    WHERE id = v_completion.id;

    RETURN jsonb_build_object(
        'success', true,
        'new_balance', v_new_balance,
        'stars_added', v_routine.star_value
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
