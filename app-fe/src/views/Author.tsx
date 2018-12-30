import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { fetchAuthor } from '../redux/actions/authors';

import { AuthorType } from '../interfaces/author';
import { AuthorBadge } from '../ui/AuthorBadge';
import { FlexList } from '../ui/FlexList';
import { PackageCard } from '../ui/PackageCard';
import './Author.scss';

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
      <section className="author">
        <h2 className="author__section-title">Author</h2>
        <AuthorBadge {...this.props.author} showPackages />
        <h2 className="author__section-title">Packages Authored</h2>
        {
          packages &&
          <FlexList
            listItems={packages}
            componentToMap={props => <PackageCard {...props} truncate />
            }
          />
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