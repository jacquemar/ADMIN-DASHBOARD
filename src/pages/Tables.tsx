import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

import TableThree from '../components/Tables/TableThree';
import TableTwo from '../components/Tables/TableTwo';

const Tables = () => {
  return (
    <>
      <Breadcrumb pageName="Tableaux" />

      <div className="flex flex-col gap-10">
   
        <TableTwo />
        <TableThree />
      </div>
    </>
  );
};

export default Tables;
