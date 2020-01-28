class QuinError extends Error {}

// Rule Errors
class RuleError extends QuinError {}
export const AllowRuleError = class extends RuleError {};
export const DenyRuleError = class extends RuleError {};
export const RangeRuleError = class extends RuleError {};
export const EmailRuleError = class extends RuleError {};
export const RequiredRuleError = class extends RuleError {};
export const SelflessRuleError = class extends RuleError {};
export const ImmutableRuleError = class extends RuleError {};
