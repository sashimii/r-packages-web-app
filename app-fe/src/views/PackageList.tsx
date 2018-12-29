import { parse } from 'query-string';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { fetchPackagesPerPage } from '../redux/actions/packages';
import { PackageCard } from '../ui/PackageCard';

import './PackageList.scss';

interface PackageListProps {
  packageList: any;
  location: any;
  dispatch(): void;
}

class PackageList extends React.Component<PackageListProps, any> {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.fetchPage();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      this.fetchPage();
    }
  }

  fetchPage() {
    const { search } = this.props.location;
    const { packageList } = this.props;
    const { page } = parse(search);
    if (packageList && search.length > 0 && packageList[page] === undefined) {
      fetchPackagesPerPage(page)(this.props.dispatch);
    } else if (page === undefined) {
      fetchPackagesPerPage()(this.props.dispatch);
    }
  }

  getCurrentPage() {
    return this.props.location && this.props.location.search.length > 0 ? parse(this.props.location.search).page : '1';
  }

  render() {
    const { packageList } = this.props;
    const packages = packageList[this.getCurrentPage()];
    return packages ? (
      <section className="package-list">
        <div className="package-list--padded">
          <h2 className="package-list__section-title">Package List</h2>

          {
            packages && packages.map((rPackage, index) => <PackageCard key={`r-package-${index}`} {...rPackage}/>)
          }
        </div>
      </section>
    ) : null;
  }
}

// export const PackageList: React.SFC<PackageListProps> = ({packageList}) => {
//   console.log(packageList);
//
// };

const mapStateToProps = ({ packageList }) => {
  return {
    packageList,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PackageList) as any);