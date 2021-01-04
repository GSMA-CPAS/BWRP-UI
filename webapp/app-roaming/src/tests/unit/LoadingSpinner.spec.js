/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import {mount} from '@vue/test-utils';
import LoadingSpinner from '@/components/other/LoadingSpinner';

describe('LoadingSpinner', () => {
  test('show spinner when loading-state', () => {
    const wrapper = mount(LoadingSpinner, {propsData: {isLoading: false}});
    expect(wrapper.exists()).toBe(true);
  });
});
