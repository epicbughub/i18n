// @ts-ignore
import { cache } from 'react';

import type { Context } from '../types';
import { createDefaultContext } from '../common/context';

/**
 * Returns the i18n context for the current request.
 */
export const getContext: () => Context = cache(() => createDefaultContext());
