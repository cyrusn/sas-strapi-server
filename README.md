# cohort transition

# Routes
- GET /students/
  - filter query: 'school_year', 'regno', 'classcode', 'classno'

- GET /conducts/ 
  - filter query: 'school_year', 'regno', 'classcode', 'teacher', 'item_code', 'event_date', 'term', 'start_date', 'end_date'
  - example: /students/?teacher=CYN&regno=1234567

- GET /attendances/ 
  - filter query: 'school_year', 'regno', 'classcode', createdBy, 'type', 'event_date', 'term', 'start_date', 'end_date'
  - example: /students/?teacher=CYN&regno=1234567

- GET /merit-demerits/ 
  - filter query: 'school_year', 'regno', 'classcode', 'teacher', 'type', 'event_date', 'term', 'start_date', 'end_date'
  - example: /students/?teacher=CYN&regno=1234567