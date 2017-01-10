import Link from 'next/link'
import PostList from '../components/PostList'
import withData from '../lib/withData'

function App () {
  return (
    <div>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <PostList />
    </div>
  )
}
export default withData(App)