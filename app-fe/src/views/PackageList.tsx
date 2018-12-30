import { parse } from 'query-string';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import { fetchPackagesPerPage } from '../redux/actions/packages';
import { FlexList } from '../ui/FlexList';
import { PackageCard } from '../ui/PackageCard';

import { PackageType } from '../interfaces/package';
import { Pagination } from '../ui/Pagination';
import './PackageList.scss';

interface PackageList {
  page: string;
  pages: number;
  [id: number]: Array<PackageType>;
}

interface PackageListProps {
  packageList: PackageList;
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
    return this.props.location && this.props.location.search.length > 0 ? parseInt(parse(this.props.location.search).page) : 1;
  }

  getPages() {
    const { pages } = this.props.packageList;
    return pages && Array(pages).fill(1).map((num, index) => num + index);
  }

  render() {
    const { packageList } = this.props;
    const page = this.getCurrentPage();
    const packages = packageList[page];
    const pages = this.getPages();
    return packages ? (
      <section className="package-list">
        <div className="package-list--padded">

          <h2 className="package-list__section-title">Pages</h2>
          {
            pages &&
            pages.length > 1 ? (
              <Pagination pages={pages} selected={page} />
            ) : null
          }
          <h2 className="package-list__section-title">Package List</h2>
          {
            packages &&
            <FlexList
              listItems={packages}
              componentToMap={props => <PackageCard {...props} truncate />
              }
            />
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