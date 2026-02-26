-- For S6 students, move all records from term 1 to term 2
-- All reports will be generated from term 2
-- e.g. 2023-24
-- Conduct 
UPDATE conducts as c
SET
  term = 2
FROM
  cohort_student_maps as m
WHERE
  m.regno = c.regno AND 
  m.classcode ~ '^6'AND
  c.school_year = 2023 AND
  c.term = 1;

-- Attendances
UPDATE attendances as a
SET
  term = 2
FROM
  cohort_student_maps as m
WHERE
  m.regno = a.regno AND 
  m.classcode ~ '^6'AND
  a.school_year = 2023 AND
  a.term = 1;

