/**
 * Answer normalization + checking, shared across exercise types.
 *
 * PA Dutch has no single standardized orthography (PRD Section 2 / Q11), so we
 * are forgiving on case, surrounding punctuation, and doubled whitespace, while
 * still requiring the learner to produce the right word(s).
 */

export function normalize(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:'"()]/g, "")
    .replace(/\s+/g, " ");
}

/** True if `input` matches `answer` or any accepted variant. */
export function checkText(input: string, answer: string, accepted: string[] = []): boolean {
  const n = normalize(input);
  if (n.length === 0) return false;
  return [answer, ...accepted].some((a) => normalize(a) === n);
}

/** Word-bank equality: token sequences match after normalization. */
export function checkTokens(input: string[], answer: string[]): boolean {
  if (input.length !== answer.length) return false;
  return input.every((tok, i) => normalize(tok) === normalize(answer[i]));
}
