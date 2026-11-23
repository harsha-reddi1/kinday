-- =============================================================================
-- kinDay Seed Data: Curated Routine Templates & Toddler Activity Cards
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Curated Toddler Activity Cards (Ages 1 to 3)
-- Simple, supervised sensory and motor play ideas (No brands, zero medical claims)
-- -----------------------------------------------------------------------------
INSERT INTO public.activity_cards (title, category, min_age_months, max_age_months, description, materials) VALUES
('Water Splash Cup Play', 'Sensory', 12, 24, 'Fill a shallow plastic bowl with water and give toddler plastic cups and a small sponge to squeeze.', 'Plastic bowl, sponge, plastic cups, towel'),
('Texture Discovery Tray', 'Sensory', 12, 36, 'Gather soft cloth, crinkly paper, smooth wooden spoons, and safe plastic items for sensory exploration.', 'Assorted safe household textures'),
('Cardboard Box Tunnel', 'Motor Skills', 12, 30, 'Open both ends of a large shipping box to create a mini crawl-through tunnel.', 'Large clean cardboard box'),
('Kitchen Drumming Band', 'Creative', 12, 36, 'Turn upside-down plastic containers or pots and let child drum with wooden spoons.', 'Pots, plastic tubs, wooden spoons'),
('Sock Puppet Hello', 'Language', 12, 36, 'Put a clean sock on your hand and make funny faces/sounds while having a mini conversation.', 'Clean sock, imagination'),
('Color Object Hunt', 'Language', 24, 36, 'Pick one color (e.g. Yellow) and wander together around the room finding 3 yellow toys.', 'Household toys in simple colors'),
('Pillow Obstacle Path', 'Motor Skills', 18, 36, 'Lay sofa cushions on a carpeted floor for child to step over, climb, and balance.', 'Sofa cushions, carpeted floor'),
('Ice Cube Melting Bowl', 'Sensory', 24, 36, 'Place 2-3 large ice cubes in a bowl and watch them glide and melt with warm water drops.', 'Ice cubes, safe plastic bowl'),
('Paper Tear & Drop', 'Motor Skills', 14, 30, 'Give scrap paper or non-toxic tissue paper for child to tear into strips and drop into a bucket.', 'Scrap paper, small bucket'),
('Nature Leaf Rubbing', 'Creative', 24, 36, 'Place flat leaves under paper and gently rub with a broad crayon to reveal nature patterns.', 'Leaves, paper, thick crayons');

-- -----------------------------------------------------------------------------
-- 2. Curated Routine Templates (Reference Template Table)
-- Used when a parent adds a child to prepopulate starter routines
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.routine_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    age_band TEXT NOT NULL, -- 'kid_4_to_6' or 'kid_7_to_10'
    title TEXT NOT NULL,
    icon_preset TEXT NOT NULL,
    time_of_day routine_time_of_day NOT NULL,
    default_star_value INT NOT NULL DEFAULT 1,
    needs_approval BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO public.routine_templates (age_band, title, icon_preset, time_of_day, default_star_value, needs_approval) VALUES
-- Ages 4 to 6 (Picture-first, foundational independence)
('kid_4_to_6', 'Brush Teeth (Morning)', 'brush_teeth', 'morning', 1, true),
('kid_4_to_6', 'Put on Clothes', 'dress_up', 'morning', 1, true),
('kid_4_to_6', 'Pack Backpack', 'schoolbag', 'morning', 2, true),
('kid_4_to_6', 'Put Shoes on Rack', 'shoes', 'afternoon', 1, false),
('kid_4_to_6', 'Tidy Up Toys', 'toy_box', 'evening', 1, true),
('kid_4_to_6', 'Storytime / Picture Book', 'read_book', 'evening', 2, false),
('kid_4_to_6', 'Bedtime on Time', 'sleep', 'evening', 2, true),

-- Ages 7 to 10 (Longer routines, responsibility, homework)
('kid_7_to_10', 'Morning Bed Making', 'make_bed', 'morning', 1, false),
('kid_7_to_10', 'School Bag & Water Bottle Ready', 'schoolbag', 'morning', 1, false),
('kid_7_to_10', 'Homework & School Review', 'homework', 'afternoon', 3, true),
('kid_7_to_10', 'Independent Reading (20 Mins)', 'read_book', 'afternoon', 2, false),
('kid_7_to_10', 'Organize Desk / Room', 'tidy_room', 'evening', 2, true),
('kid_7_to_10', 'Prepare Clothes for Tomorrow', 'prepare_clothes', 'evening', 1, false),
('kid_7_to_10', 'Lights Out & Sleep', 'sleep', 'evening', 2, false);
