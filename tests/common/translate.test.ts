import { describe, expect, test } from "vitest";

import { translate } from "../../src/common";
import { getContext } from "../../src/server/context";
import { initialize } from "../../src/server/translator";

describe('Translate Tests', () => {
  test('Translate the given key', () => {
    initialize('es');

    const translation = translate('the_key', getContext());

    expect(translation).toBe('es:the_key');
  });
});
