# Logic Flow Specification (Plain English Logic)

## Overview

Logic Flow is a structured, plain English pseudocode used to document software logic and actor interactions. It is the primary language for `Section B` and `Section C` of design documents.

## Syntax Rules

### Steps and Nesting

1. Steps MUST be numbered.
2. Nesting MUST use sub-numbering (e.g., `1.1`, `1.1.1`).
3. Each step MUST contain only one primary action or decision.

### Keywords

#### Conditional: IF / ELSE

```markdown
1. IF Condition is met:
   1.1. Action A
2. ELSE:
   2.1. Action B
```

#### Looping: FOR EACH

```markdown
1. FOR EACH item in the list:
   1.1. Process the item
```

#### Termination: STOP

Used to exit a flow immediately.

```markdown
1. IF error occurred:
   1.1. Show error message
   1.2. STOP
```

#### Logical Operators: AND / OR

Used within conditions.

```markdown
1. IF (A is true) AND (B is false):
   ...
```

## Prohibitions

1. **No Code Symbols**: Avoid `{ }`, `[ ]`, `=>`, `===`, `&&`, `||`, `;`.
2. **No Data Types**: Use "a number" or "text", not `integer` or `string`.
3. **No Implementation Details**: Do not mention specific function names, database tables, or variables.

## Examples

### Good (Standard Logic Flow)

1. User clicks "Submit" button.
2. System checks if email is valid.
3. IF email is invalid:
   3.1. Show "Invalid email" error.
   3.2. STOP.
4. System saves user to database.

### Bad (Contains Code)

1. User clicks submit.
2. `if (!validate(email)) { throw new Error('invalid'); }`
3. DB.save(user);
