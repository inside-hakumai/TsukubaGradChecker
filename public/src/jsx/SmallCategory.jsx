let React = require('react');
let Unit = require('./Unit.jsx');
const LARGE_CATEGORY = ['MS', 'FSM', 'GFS_common', 'GFS_related'];
const LARGE_CATEGORY_NAME = ['専門科目', '専門基礎科目', '基礎科目(共通科目)', '基礎科目(関連科目)'];
const SMALL_CATEGORY = ['required', 'elective', 'free'];
const SMALL_CATEGORY_NAME = ['必修科目', '選択科目', '自由科目'];

class SmallCategory extends React.Component {

   constructor(props) {
      super(props);
   }

   render() {
      let idName = 'panel-' + LARGE_CATEGORY[this.props.parentType] + '-' + SMALL_CATEGORY[this.props.type];
      let categoryName = SMALL_CATEGORY_NAME[this.props.type];

      return (
         <div id={idName} className="small-category">
            <h4>{categoryName}</h4>
            {
               (() => {
                  console.log(this.props.addup);
                  if (this.props.addup) {
                     let addupDescription = null;
                     let addupStatus;
                     let addup_info = this.props.calAddupList();
                     let status_class = '';
                     addupDescription = addup_info[2];
                     addupStatus = '取得単位数 : ' + addup_info[0] + ' / 必要単位数 : ' + addup_info[1];
                     if (addup_info[1] <= addup_info[0]) {
                        status_class = 'filled';
                     } else {
                        status_class = 'unfilled';
                     }
                     return (
                        <div className={status_class + ' mdl-card mdl-shadow--4dp addup-info'}>
                           <div className="mdl-card__supporting-text">
                              <span>{addupDescription}</span>{addupStatus}
                           </div>
                        </div>
                     );
                  }
               })()
            }
            <div className="panel-collapse collapse in" id={idName + '-collapse'}>
               <div className="panel-body">
                  {
                     (() => {
                        let parentThis = this;
                        if (this.props.determined) {
                           // console.info(this.props.units);
                           return (
                              <table id={idName + '-result'}
                                     className="mdl-data-table mdl-js-data-table mdl-shadow--2dp result-table">
                                 <thead>
                                 <tr>
                                    <th className="mdl-data-table__cell--non-numeric">科目名</th>
                                    <th>単位数</th>
                                    <th>状態</th>
                                 </tr>
                                 </thead>
                                 <tbody>
                                 {
                                    this.props.units.map(function (unit) {
                                       return (
                                          <Unit determined={true} key={unit['id']} data={unit}/>
                                       );
                                    })
                                 }
                                 </tbody>
                              </table>
                           );
                        } else {
                           return (
                              <div id={idName + '-result'}>
                                 {
                                    this.props.units.map(function (unit) {
                                       return (
                                          <Unit calAddupList={parentThis.props.calAddupList}
                                                isInAddupList={parentThis.props.isInAddupList} determined={false}
                                                key={unit['id']}
                                                data={unit}/>
                                       );
                                    })
                                 }
                              </div>
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

module.exports = SmallCategory;
