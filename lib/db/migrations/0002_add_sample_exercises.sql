-- Add sample exercises for testing search and filtering functionality
INSERT INTO "exercises" ("id", "name", "muscle_groups", "is_custom", "created_at", "updated_at") VALUES
-- Chest exercises
('550e8400-e29b-41d4-a716-446655440001', 'Bench Press', ARRAY['Chest', 'Triceps', 'Shoulders'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Push-ups', ARRAY['Chest', 'Triceps', 'Shoulders'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Dumbbell Flyes', ARRAY['Chest'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Incline Bench Press', ARRAY['Chest', 'Triceps', 'Shoulders'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Decline Bench Press', ARRAY['Chest', 'Triceps'], false, NOW(), NOW()),

-- Back exercises
('550e8400-e29b-41d4-a716-446655440006', 'Pull-ups', ARRAY['Back', 'Biceps'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440007', 'Deadlift', ARRAY['Back', 'Hamstrings', 'Glutes'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440008', 'Barbell Rows', ARRAY['Back', 'Biceps'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440009', 'Lat Pulldowns', ARRAY['Back', 'Biceps'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440010', 'T-Bar Rows', ARRAY['Back', 'Biceps'], false, NOW(), NOW()),

-- Shoulder exercises
('550e8400-e29b-41d4-a716-446655440011', 'Overhead Press', ARRAY['Shoulders', 'Triceps'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440012', 'Lateral Raises', ARRAY['Shoulders'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440013', 'Front Raises', ARRAY['Shoulders'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440014', 'Rear Delt Flyes', ARRAY['Shoulders'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440015', 'Arnold Press', ARRAY['Shoulders', 'Triceps'], false, NOW(), NOW()),

-- Biceps exercises
('550e8400-e29b-41d4-a716-446655440016', 'Barbell Curls', ARRAY['Biceps'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440017', 'Dumbbell Curls', ARRAY['Biceps'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440018', 'Hammer Curls', ARRAY['Biceps', 'Forearms'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440019', 'Preacher Curls', ARRAY['Biceps'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440020', 'Concentration Curls', ARRAY['Biceps'], false, NOW(), NOW()),

-- Triceps exercises
('550e8400-e29b-41d4-a716-446655440021', 'Tricep Dips', ARRAY['Triceps', 'Chest'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440022', 'Skull Crushers', ARRAY['Triceps'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440023', 'Tricep Pushdowns', ARRAY['Triceps'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440024', 'Overhead Tricep Extensions', ARRAY['Triceps'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440025', 'Diamond Push-ups', ARRAY['Triceps', 'Chest'], false, NOW(), NOW()),

-- Core exercises
('550e8400-e29b-41d4-a716-446655440026', 'Plank', ARRAY['Core'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440027', 'Crunches', ARRAY['Core'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440028', 'Russian Twists', ARRAY['Core'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440029', 'Leg Raises', ARRAY['Core'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440030', 'Mountain Climbers', ARRAY['Core', 'Cardio'], false, NOW(), NOW()),

-- Leg exercises
('550e8400-e29b-41d4-a716-446655440031', 'Squats', ARRAY['Quadriceps', 'Glutes'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440032', 'Lunges', ARRAY['Quadriceps', 'Glutes'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440033', 'Leg Press', ARRAY['Quadriceps', 'Glutes'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440034', 'Romanian Deadlift', ARRAY['Hamstrings', 'Glutes'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440035', 'Leg Extensions', ARRAY['Quadriceps'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440036', 'Leg Curls', ARRAY['Hamstrings'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440037', 'Calf Raises', ARRAY['Calves'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440038', 'Glute Bridges', ARRAY['Glutes', 'Hamstrings'], false, NOW(), NOW()),

-- Full Body exercises
('550e8400-e29b-41d4-a716-446655440039', 'Burpees', ARRAY['Full Body', 'Cardio'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440040', 'Thrusters', ARRAY['Full Body'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440041', 'Turkish Get-ups', ARRAY['Full Body'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440042', 'Man Makers', ARRAY['Full Body'], false, NOW(), NOW()),

-- Cardio exercises
('550e8400-e29b-41d4-a716-446655440043', 'Running', ARRAY['Cardio'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440044', 'Cycling', ARRAY['Cardio'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440045', 'Jump Rope', ARRAY['Cardio', 'Calves'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440046', 'Rowing', ARRAY['Cardio', 'Back'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440047', 'Elliptical', ARRAY['Cardio'], false, NOW(), NOW()),

-- Forearm exercises
('550e8400-e29b-41d4-a716-446655440048', 'Wrist Curls', ARRAY['Forearms'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440049', 'Reverse Wrist Curls', ARRAY['Forearms'], false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440050', 'Farmer''s Walks', ARRAY['Forearms', 'Core'], false, NOW(), NOW()); 