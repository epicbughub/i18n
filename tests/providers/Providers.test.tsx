// @vitest-environment jsdom
import React from 'react';
import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';

import SomeClientComponent from './SomeClientComponent';
import { I18nProvider } from '../../src/server/I18nProvider';
import { initialize, translator } from '../../src/server/translator';

describe('Providers Test', () => {
  test('it renders something', async () => {
    initialize('us');
    await translator();

    render(
      <I18nProvider>
        <SomeClientComponent />
      </I18nProvider>,
    );

    expect(screen.getByText('Welcome!')).toBeDefined();
  });
});
