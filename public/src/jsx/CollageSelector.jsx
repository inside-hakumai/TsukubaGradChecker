let React = require('react');

function CollageSelector() {
   return (
      <div className="mdl-cell mdl-cell--6-col">
         <p>1. 入学年度・学類を選択します</p>
         <div id="collage-input-wrapper" className="mdl-textfield mdl-js-textfield">
            <select className="mdl-textfield__input" id="collage">
               <option value="coins_26_software">情報科学類 / H26年度入学 / ソフトウェアサイエンス主専攻</option>
               <option value="coins_26_jyoshisu">情報科学類 / H26年度入学 /情報システム主専攻</option>
               <option value="coins_26_intelligence">情報科学類 / H26年度入学 / 知能情報メディア主専攻</option>
               <option value="coins_27_software">情報科学類 / H27年度以降入学 / ソフトウェアサイエンス主専攻</option>
               <option value="coins_27_jyoshisu">情報科学類 / H27年度以降入学 /情報システム主専攻</option>
               <option value="coins_27_intelligence">情報科学類 / H27年度以降入学 / 知能情報メディア主専攻</option>
            </select>
         </div>
      </div>
   );
}

module.exports = CollageSelector;
