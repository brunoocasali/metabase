drop view if exists v_view_log;

create or replace view v_view_log as
(
select
    id,
    timestamp,
    coalesce(user_id, 0) as user_id,
    model as entity_type,
    model_id as entity_id,
    model || '_' || model_id as entity_qualified_id
from view_log
)
