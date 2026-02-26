# Notes for update strapi v5

## TODO

- backup database
- rename ./data/ to ./data_v4 and mkdir ./data
- run `docker compose build --no-cache` to rebuild everything
- after run `docker compose up -d`, run `cat ./path_to_database_backup.sql | docker exec -it strapiDB psql -U strapi`
- some data may not able to import to database, you may need to run
  - `delete from students`
  - `delete from conducts`
  - `delete from attendances`
  - `delete from cohort_student_maps`
  - and import the data again
- in google script, remove `.map(({ id, attributes }) => ({ id, ...attributes }))`
- it needs to set the password, in `docker exec -it strapiDB psql -U strapi` run `\password` to update the password
