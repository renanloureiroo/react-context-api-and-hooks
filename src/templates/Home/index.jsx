import { Component } from "react";

import "./styles.css";

import { Posts } from "../../components/Posts";
import { loadPosts } from "../../ultis/load-posts";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";

class Home extends Component {
  state = {
    posts: [],
    allPosts: [],
    page: 0,
    postPerPage: 6,
    searchValue: "",
  };

  async componentDidMount() {
    await this.loadPosts();
  }

  loadPosts = async () => {
    const { page, postPerPage } = this.state;

    const postsAndPhotos = await loadPosts();
    this.setState({
      posts: postsAndPhotos.slice(page, postPerPage),
      allPosts: postsAndPhotos,
    });
  };

  loadMorePosts = () => {
    const { page, postPerPage, posts, allPosts } = this.state;

    const nextPage = page + postPerPage;
    const nextPosts = allPosts.slice(nextPage, nextPage + postPerPage);
    posts.push(...nextPosts);

    this.setState({ posts, page: nextPage });
  };

  handleChange = (e) => {
    const { value } = e.target;
    this.setState({ searchValue: value });
  };

  render() {
    const { posts, page, postPerPage, allPosts, searchValue } = this.state;
    const noMorePosts = page + postPerPage >= allPosts.length;

    // Filtrando os posts pelo termo de pesquisa, caso o input value nao seja vazio, se estiver vaziom redenriza os posts do state normal
    const filteredPosts = !!searchValue
      ? allPosts.filter((post) => {
          return post.title.toLowerCase().includes(searchValue.toLowerCase());
        })
      : posts;
    // <-- end -->

    return (
      <section className="container">
        <div className="search-container">
          <Input searchValue={searchValue} handleChange={this.handleChange} />
          {!!searchValue && (
            <p className="result">Resultados para: {searchValue}</p>
          )}
        </div>
        {filteredPosts.length > 0 && <Posts posts={filteredPosts} />}

        {filteredPosts.length === 0 && <p>Sem reultados correspondentes :(</p>}
        <div className="button-container">
          {!searchValue && (
            <Button onClick={this.loadMorePosts} disabled={noMorePosts} />
          )}
        </div>
      </section>
    );
  }
}

export default Home;
