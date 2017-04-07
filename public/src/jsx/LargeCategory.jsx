let React = require('react');
let SmallCategory = require('./SmallCategory.jsx');
const LARGE_CATEGORY = ['MS', 'FSM', 'GFS_common', 'GFS_related'];
const LARGE_CATEGORY_NAME = ['専門科目', '専門基礎科目', '基礎科目(共通科目)', '基礎科目(関連科目)'];
const SMALL_CATEGORY = ['required', 'elective', 'free'];
const SMALL_CATEGORY_NAME = ['必修科目', '選択科目', '自由科目'];

class LargeCategory extends React.Component {

   constructor(props) {
      super(props);
   }

   render() {
      let idName = 'panel-' + LARGE_CATEGORY[this.props.type];
      let categoryName = LARGE_CATEGORY_NAME[this.props.type];

      return (
         <div id={idName} className="large-category">
            <h3>{categoryName}</h3>
            <div className="panel-collapse collapse in" id={idName + '-collapse'}>
               <div className="panel-body">
                  {
                     (() => {
                        if (this.props.units['required'].length != 0) {
                           return (
                              <SmallCategory units={this.props.units['required']} calAddupList={this.props.calAddupList}
                                             isInAddupList={this.props.isInAddupList}
                                             determined={this.props.units['determined'][0]}
                                             addup={this.props.units['addup'][0]}
                                             parentType={this.props.type} type={0}/>
                           );
                        }
                     })()
                  }
                  {
                     (() => {
                        if (this.props.units['elective'].length != 0) {
                           return (
                              <SmallCategory units={this.props.units['elective']} calAddupList={this.props.calAddupList}
                                             isInAddupList={this.props.isInAddupList}
                                             determined={this.props.units['determined'][1]}
                                             addup={this.props.units['addup'][1]}
                                             parentType={this.props.type} type={1}/>
                           );
                        }
                     })()
                  }
                  {
                     (() => {
                        if (this.props.units['free'].length != 0) {
                           return (
                              <SmallCategory units={this.props.units['free']} calAddupList={this.props.calAddupList}
                                             isInAddupList={this.props.isInAddupList}
                                             determined={this.props.units['determined'][2]}
                                             addup={this.props.units['addup'][2]}
                                             parentType={this.props.type} type={2}/>
                           );
                        }
                     })()
                  }
               </div>
            </div>
         </div>
      );

   }

}

module.exports = LargeCategory;
