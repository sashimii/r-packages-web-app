import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { fetchPackage } from '../redux/actions/packages';

import { PackageType } from '../interfaces/package';
import { AuthorBadge } from '../ui/AuthorBadge';
import { FlexList } from '../ui/FlexList';
import { PackageCard } from '../ui/PackageCard';

import './Package.scss';

interface PackageProps extends PackageType {
  package: PackageType;
  match: any;
  location: any;
  dispatch(): void;
}

class Package extends React.Component<PackageProps, any> {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.fetchPackage();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.packageId !== this.props.match.params.packageId) {
      this.fetchPackage();
    }
  }

  fetchPackage() {
    const { packageId } = this.props.match.params;
    fetchPackage(packageId)(this.props.dispatch);
  }

  render() {
    const { authors } = this.props.package;
    return this.props.package ? (
      <section className="package">
        <h2 className="package__section-title">Package:</h2>
        <PackageCard {...this.props.package}/>
        <h2 className="package__section-title">Package Authors:</h2>

        {
          authors &&
          <FlexList
            listItems={authors}
            componentToMap={props => <AuthorBadge {...props} />}
          />
        }
        {/* {
          authors &&
          authors.map((author, index) => <AuthorBadge key={`package-authors-${index}`} {...author}/>)
        } */}
      </section>
      // <PackageCard {...this.props.package}/>
    ) : null;

  }

}

const mapStateToProps = ({ currentPackage }) => {
  return {
    package: currentPackage,
  };
};

const mapDispatchToProps = dispatch => {
  return { dispatch };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Package) as any);