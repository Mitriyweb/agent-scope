# Tasks: Architecture Consistency Validation

- [ ] **1. Implement Logic Flow Scanner**
  - [ ] Create `LogicFlowScanner` utility to detect code in logic sections.
  - [ ] Add tests for `LogicFlowScanner`.
- [ ] **2. Implement Cross-Feature Consistency Checks**
  - [ ] Add logic to `Validator` to check for type collisions.
  - [ ] Add tests for type redefinition detection.
- [ ] **3. Implement Scoring Engine**
  - [ ] Define scoring weights for design sections.
  - [ ] Integrate scoring into `design-validate` and `feature-validate` outputs.
- [ ] **4. Update Workflows**
  - [ ] Link workflows to automated CLI validation commands (once implemented).
- [ ] **5. Verification**
  - [ ] Run full validation on existing `agent-scope` design docs.
