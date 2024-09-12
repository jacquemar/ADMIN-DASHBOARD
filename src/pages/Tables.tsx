import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

import TableThree from '../components/Tables/TableThree';
import TableTwo from '../components/Tables/TableTwo';
import Suspension from '../components/Tables/Suspension';
import Message from '../components/Tables/Messages';
import Devis from "../components/Tables/DevisList"

const Tables = () => {
  return (
    <>
      <Breadcrumb pageName="Tableaux" />

      <div className="flex flex-col gap-10">
   
        <TableTwo />
        <TableThree />
        <Suspension/>
        <Message/>
        <Devis/>
      </div>
    </>
  );
};

export default Tables;
