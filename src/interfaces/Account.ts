interface IncomeSubCategory {
  id: string;
  name: string;
  details: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  category_id: string;
  institute_id: string;
}

interface MainCategory {
  id: string;
  name: string;
  details: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  institute_id: string;
  income_sub_category: IncomeSubCategory[];
}

interface Item {
  Details: any;
  category: string;
  amount: number;
}

export interface IncomeEntryI {
  details: string;
  main_category: string;
  items: Item[];
  account_id: string;
  transaction_type: string;
}
