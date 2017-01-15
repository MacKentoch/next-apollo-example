import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

function Submit (props) {
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      let title = e.target.elements.title.value
      let url = e.target.elements.url.value
      if (title === '' || url === '') {
        window.alert('Both fields are required.')
        return false
      }
      // prepend http if missing from url
      if (!url.match(/^[a-zA-Z]+:\/\//)) {
        url = `http://${url}`
      }
      props.createPost(title, url)
      // reset form
      e.target.elements.title.value = ''
      e.target.elements.url.value = ''
    }}>
      <h1>Submit</h1>
      <input placeholder='title' name='title' />
      <input placeholder='url' name='url' />
      <button type='submit'>Submit</button>
      <style jsx>{`
        form {
          border-bottom: 1px solid #ececec;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        h1 {
          font-size: 20px;
        }
        input {
          display: block;
          margin-bottom: 10px;
        }
      `}</style>
    </form>
  )
}

function isUrl (str) {
  const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
  '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator
  return pattern.test(str)
}

const createPost = gql`
  mutation createPost($title: String!, $url: String!) {
    createPost(title: $title, url: $url) {
      id
      title
      votes
      url
    }
  }
`

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (PostList here)
export default graphql(createPost, {
  props: ({ ownProps, mutate }) => ({
    createPost: (title, url) => mutate({
      variables: { title, url },
      updateQueries: {
        allPosts: (previousResult, { mutationResult }) => {
          const newPost = mutationResult.data.createPost
          return Object.assign({}, previousResult, {
            allPosts: [...previousResult.allPosts, newPost]
          })
        }
      }
    })
  })
})(Submit)