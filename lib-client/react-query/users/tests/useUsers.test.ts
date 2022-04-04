import { renderHook } from '@testing-library/react-hooks';
import { createWrapper } from 'test/test-utils';
import { useUsers } from 'lib-client/react-query/users/useUsers';
import { GetUsersQueryParams } from 'pages/api/users';
import { fakeUsers } from 'test/server/fake-data';

describe('useUsers', () => {
  test('successful query users hook', async () => {
    const page = 1;
    const username = fakeUsers.items[0].username;

    const params: GetUsersQueryParams = { page, searchTerm: username };

    const { result, waitFor } = renderHook(() => useUsers(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data.pagination.currentPage).toBe(page);
    expect(result.current.data.pagination.total).toBe(1);
    expect(result.current.data.items[0].username).toBe(username);
  });
});
