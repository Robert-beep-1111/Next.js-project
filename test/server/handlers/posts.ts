import { DefaultRequestBody, PathParams, rest } from 'msw';
import { PaginatedResponse, PostWithAuthor } from 'types';
import { Routes } from 'lib-client/constants';
import { fakePosts, fakePostWithAuthor } from 'test/server/fake-data';
import { Post } from '@prisma/client';

const postsHandlers = [
  // usePost /api/posts/:id
  // must come first
  // both test and msw mock coupled to fakePostWithAuthor, maybe it could be better
  rest.get<DefaultRequestBody, PathParams, PostWithAuthor>(
    `${Routes.API.POSTS}:id`,
    (req, res, ctx) => {
      const { id: postId } = req.params;

      // can be 0
      if (!isNaN(Number(postId))) {
        return res(ctx.status(200), ctx.json(fakePostWithAuthor));
      }
    }
  ),
  // useUpdatePost
  // just forward what you received
  rest.patch<DefaultRequestBody, PathParams, PostWithAuthor>(
    `${Routes.API.POSTS}:id`,
    (req, res, ctx) => {
      const postId = Number(req.params.id);

      if (fakePostWithAuthor.id !== postId) throw new Error('Invalid fake post.id.');

      if (!isNaN(postId)) {
        const post = req.body as PostWithAuthor; // PostUpdateType, incomplete
        // username needed in useUpdatePost, updated title
        return res(ctx.status(200), ctx.json({ ...fakePostWithAuthor, ...post }));
      }
    }
  ),
  // 1. usePosts
  // 2. usePosts ?searchTerm=xxx
  rest.get<DefaultRequestBody, PathParams, PaginatedResponse<PostWithAuthor>>(
    Routes.API.POSTS,
    (req, res, ctx) => {
      const searchTerm = req.url.searchParams.get('searchTerm');

      if (!searchTerm) {
        // 1.
        return res(ctx.status(200), ctx.json(fakePosts));
      } else {
        // 2.
        // insert searchTerm at second posts title, return only second
        const _fakePosts = {
          ...fakePosts,
          items: [
            { ...fakePosts.items[1], title: `${searchTerm} ${fakePosts.items[1].title}` },
          ],
        };
        return res(ctx.status(200), ctx.json(_fakePosts));
      }
    }
  ),
  // useCreatePost
  rest.post<DefaultRequestBody, PathParams, Post>(Routes.API.POSTS, (req, res, ctx) => {
    const post = req.body as Post; // just forward what you received
    return res(ctx.status(200), ctx.json(post));
  }),
];

export default postsHandlers;
