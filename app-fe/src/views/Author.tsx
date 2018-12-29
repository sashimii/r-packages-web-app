import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { fetchAuthor } from '../redux/actions/authors';

import { AuthorType } from '../interfaces/author';
import { PackageCard } from '../ui/PackageCard';

interface AuthorProps {
  author: AuthorType;
  match: any;
  location: any;
  dispatch(): void;
}

class Author extends React.Component<AuthorProps, any> {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.fetchAuthor();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.authorId !== this.props.match.params.authorId) {
      this.fetchAuthor();
    }
  }

  fetchAuthor() {
    const { authorId } = this.props.match.params;
    fetchAuthor(authorId)(this.props.dispatch);
  }

  render() {
    const { name, email, packages } = this.props.author;
    return name ? (
      <section>
        <h1>{name}</h1>
        {
          email && (
            <p>Email: <a href={`mailto:${email}`}>{email}</a></p>
          )
        }
        <h2>Packages Authored:</h2>
        {
          packages.map((rPackage, index) => <PackageCard key={`packages-authored-${index}`} {...rPackage}/>)
        }
      </section>
    ) : null;
  }

}

const mapStateToProps = ({ currentAuthor }) => {
  return { author: currentAuthor };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  };
};
// export const Author: React.SFC<AuthorProps> = ({name}) => {
//   return (
//     <section>
//       <h1>Author Name</h1>
//     </section>
//   );
// };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Author) as any);