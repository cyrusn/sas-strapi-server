#! /bin/bash
backup_file=$1

cat $backup_file | docker exec -i strapiDB psql -U strapi
