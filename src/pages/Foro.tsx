import { posts } from '../data/site'
import { PageShell } from '../components/layout/PageShell'

export function ForoPage() {
  return (
    <PageShell route="/foro">
      <section className="content-section" aria-labelledby="forum-list-title">
        <h2 id="forum-list-title" className="sr-only">Recent discussions</h2>
        <div className="post-list">
          {posts.map(post => (
            <article className="post-row" key={post.title}>
              <div><p className="post-meta">{post.user} <span>·</span> {post.time}</p><h3>{post.title}</h3></div>
              <p className="post-replies">{post.replies} replies <span aria-hidden="true">↗</span></p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
