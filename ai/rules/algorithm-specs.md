# Algorithm and Flow Specifications (Logic Flow)

## Purpose

All logic within `DESIGN.md` files (both system-level and feature-level) MUST be described in **Logic Flow (Plain English Logic)**. This ensures that logic is:

1. **Stakeholder-Reviewable**: Non-programmers can understand and approve the logic.
2. **Language-Agnostic**: Stable across implementation refactors or stack changes.
3. **AI-Friendly**: Provides clear, unambiguous instructions for code generation.

## Logic Flow Syntax Rules

### 1. Numbered Steps

Use sequential numbers for steps and sub-numbers for nesting.

```markdown
1. First step
2. Second step
   2.1. Nested action
```

### 2. Mandatory Keywords (ALL CAPS)

- **IF / ELSE**: For conditional logic.
- **FOR EACH**: For loops.
- **STOP**: To terminate a flow early.
- **AND / OR**: For logical combinations.
- **WHILE**: For conditional loops.

### 3. No Code Allowed

Actual programming code (JavaScript, TypeScript, SQL, etc.) is STRICTLY PROHIBITED in `Section B` (Actor Flows) and `Section C` (Algorithms).

- ❌ `if (user.is_admin) { show_panel(); }`
- ✅ `IF User is an administrator, show the admin panel.`

## Best Practices

- **Focus on Logic**: Describe "what" happens, not "how" the code implements it.
- **Use Actor Names**: Refer to actors defined in `BUSINESS.md`.
- **Be Explicit**: Avoid vague terms like "process the data". Use "Validate data format and save to database".

## Validation

Any design document containing actual code snippets in logic sections will FAIL validation.
Refer to [requirements/LOGIC_FLOW.md](file:///Users/dmytro.zvieriev/sandbox/agent-scope/requirements/LOGIC_FLOW.md) for full specification.
