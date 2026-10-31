# Database Schema Specification — Visit Record by Voice

## Relational Entity-Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ BENEFICIARIES : assigns
    USERS ||--o{ VISITS : conducts
    BENEFICIARIES ||--o{ VISITS : has
    VISITS ||--|| VISIT_RECORDS : generates
    VISIT_RECORDS ||--o{ EVIDENCE_SPANS : contains
    VISIT_RECORDS ||--o{ CORRECTIONS : records
    VISIT_RECORDS ||--o{ REVIEW_ACTIONS : receives
    USERS ||--o{ AUDIT_LOGS : triggers

    USERS {
        string id PK
        string name
        string phone
        string role "asha | anm | admin"
        string password_hash
        string assigned_area
        boolean is_active
        datetime created_at
    }

    BENEFICIARIES {
        string id PK
        string beneficiary_code
        string name
        string name_mr
        int age
        string assigned_asha_id FK
        string category
        int gravida
        int parity
        int gestational_weeks
        boolean high_risk
        string rch_id
        datetime created_at
    }

    VISITS {
        string id PK
        string beneficiary_id FK
        string asha_id FK
        string visit_type "ANC | PNC | Immunization"
        datetime visit_date
        string language "mr-IN | hi-IN"
        string audio_path
        float audio_duration
        text transcript
        string status "draft | submitted | synced"
        datetime created_at
    }

    VISIT_RECORDS {
        string id PK
        string visit_id FK
        json measurements_json
        json pregnancy_details_json
        json symptoms_json
        json interventions_json
        string validation_status
        boolean is_confirmed_by_asha
        datetime confirmed_at
        string anm_review_status "pending | reviewed | returned"
        text anm_review_notes
        string reviewed_by_id FK
        datetime reviewed_at
    }

    EVIDENCE_SPANS {
        string id PK
        string record_id FK
        string field_name
        string extracted_value
        int start_offset
        int end_offset
        text source_text
        float confidence
        string verification_status
    }

    CORRECTIONS {
        string id PK
        string record_id FK
        string field_name
        string original_value
        string corrected_value
        string corrected_by FK
        datetime created_at
        text reason
    }

    REVIEW_ACTIONS {
        string id PK
        string record_id FK
        string reviewer_id FK
        string action "reviewed | returned"
        text remarks
        datetime created_at
    }

    AUDIT_LOGS {
        string id PK
        string actor_id FK
        string action
        string entity_type
        string entity_id
        json details
        datetime timestamp
    }
```

---

## Table Constraints & Indexing Strategy
- `VISITS(beneficiary_id, visit_date)`: B-tree index for fast patient timeline retrieval.
- `VISIT_RECORDS(anm_review_status)`: Indexed for fast supervisor queue filtering.
- `EVIDENCE_SPANS(record_id, field_name)`: Composite index for instant evidence lookups.
- Foreign Keys enforced across all relationship tables with `ON DELETE RESTRICT` to preserve medical auditability.
