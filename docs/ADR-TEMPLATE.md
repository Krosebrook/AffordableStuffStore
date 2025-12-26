# Architecture Decision Record (ADR) Template

## ADR-XXXX: [Decision Title]

**Date**: YYYY-MM-DD

**Status**: [Proposed | Accepted | Deprecated | Superseded]

**Context**: [Link to related ADRs, issues, or documents]

---

## What

### Summary

[One or two sentences describing the decision being made]

### Problem Statement

[Describe the problem or opportunity that necessitates this decision. What challenges are we facing? What requirements must be met?]

### Decision

[Clearly state the decision that was made. Be specific and unambiguous.]

### Example / Implementation Details

```typescript
// Code example showing how this decision is implemented
// or will be implemented
```

---

## Why

### Motivation

[Explain the reasoning behind this decision. What are the driving factors? What are we trying to achieve?]

### Constraints

[List any constraints that influenced this decision:]

- Technical constraints (e.g., platform limitations, existing architecture)
- Business constraints (e.g., budget, timeline)
- Team constraints (e.g., expertise, resources)
- External constraints (e.g., third-party dependencies, regulations)

### Requirements

[List the key requirements this decision must satisfy:]

- Functional requirements
- Non-functional requirements (performance, security, scalability)
- Quality attributes (maintainability, testability)

---

## Alternatives

### Option 1: [Alternative Name]

**Description**: [Brief description of this alternative]

**Pros**:
- ✅ [Advantage 1]
- ✅ [Advantage 2]

**Cons**:
- ❌ [Disadvantage 1]
- ❌ [Disadvantage 2]

**Why Not Chosen**: [Explanation of why this wasn't selected]

---

### Option 2: [Alternative Name]

**Description**: [Brief description of this alternative]

**Pros**:
- ✅ [Advantage 1]
- ✅ [Advantage 2]

**Cons**:
- ❌ [Disadvantage 1]
- ❌ [Disadvantage 2]

**Why Not Chosen**: [Explanation of why this wasn't selected]

---

### Option 3: [Alternative Name] (if applicable)

**Description**: [Brief description of this alternative]

**Pros**:
- ✅ [Advantage 1]
- ✅ [Advantage 2]

**Cons**:
- ❌ [Disadvantage 1]
- ❌ [Disadvantage 2]

**Why Not Chosen**: [Explanation of why this wasn't selected]

---

## Impact

### Benefits

[List the positive impacts of this decision:]

- 🎯 **[Benefit Category]**: [Specific benefit]
- 🎯 **[Benefit Category]**: [Specific benefit]

### Risks & Trade-offs

[Acknowledge the risks and trade-offs associated with this decision:]

- ⚠️ **[Risk Category]**: [Specific risk and mitigation strategy]
- ⚠️ **[Risk Category]**: [Specific risk and mitigation strategy]

### Technical Impact

**Affected Components**:
- [Component/module 1]: [How it's affected]
- [Component/module 2]: [How it's affected]

**Migration Path** (if applicable):
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Breaking Changes**: [Yes/No - if yes, describe them]

### Team Impact

**Learning Curve**: [Low/Medium/High - with explanation]

**Documentation Needed**:
- [ ] Update architecture documentation
- [ ] Create implementation guide
- [ ] Update developer onboarding docs
- [ ] Add code examples

**Training Required**: [Yes/No - if yes, describe training plan]

### Business Impact

**Cost**: [Estimate of implementation and maintenance costs]

**Timeline**: [Implementation timeline and milestones]

**Performance Impact**: [Expected impact on system performance]

**Scalability Impact**: [How this affects future scaling]

---

## Implementation

### Action Items

- [ ] [Action item 1]
- [ ] [Action item 2]
- [ ] [Action item 3]

### Success Criteria

[Define measurable criteria for success:]

- [Metric 1]: [Target value]
- [Metric 2]: [Target value]

### Testing Strategy

[Describe how this decision will be validated:]

- Unit tests: [What needs to be tested]
- Integration tests: [What needs to be tested]
- Performance tests: [What needs to be measured]

### Rollout Plan

1. **Phase 1**: [Initial rollout details]
2. **Phase 2**: [Expansion details]
3. **Phase 3**: [Full deployment details]

### Monitoring

[Describe how success and health will be monitored:]

- Metrics to track
- Alerts to configure
- Dashboards to create

---

## Related

### Related ADRs

- [ADR-XXXX](./adr-XXXX.md): [Relationship description]
- [ADR-YYYY](./adr-YYYY.md): [Relationship description]

### Related Documents

- [Link to design doc]
- [Link to RFC]
- [Link to issue tracker]

### References

- [External article or documentation]
- [Research paper]
- [Best practices guide]

---

## Unknown Unknowns Radar 🔮

### Open Questions

[Questions that remain unanswered:]

- ❓ [Question 1]
- ❓ [Question 2]

### Future Considerations

[Things to watch for or revisit in the future:]

- 🔮 [Consideration 1]
- 🔮 [Consideration 2]

### Assumptions

[Explicit assumptions this decision is based on:]

- [Assumption 1]
- [Assumption 2]

### When to Revisit

[Conditions that would warrant revisiting this decision:]

- [Condition 1]
- [Condition 2]

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| YYYY-MM-DD | [Name] | Initial version |
| YYYY-MM-DD | [Name] | [Description of change] |

---

## Example ADR

See [ADR-0001: Use Vite as Build Tool](./adr-0001-use-vite.md) for a concrete example of this template in use.
