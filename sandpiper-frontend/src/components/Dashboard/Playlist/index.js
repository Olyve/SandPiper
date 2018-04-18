// import Playlist from './Playlist';
//
// export default Playlist;

import Playlist from './Playlist';
import { connect } from 'react-redux';
import * as Actions from '../../../Utilities/actions';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

const mapStateToProps = (state) => {
  return { ...state }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Playlist));
