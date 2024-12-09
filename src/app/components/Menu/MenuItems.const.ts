export interface MenuItem {
  id: string;
  caption: string;
  level: number;
  subMenu?: MenuItem[];
  isOpened?: boolean;
  link?: string;
  onClick?: () => void;
};

const customerReportsMenu: MenuItem[] = [
  { id: '1.2.1', caption: 'Individual', level: 3, link: '/pages/customers/reports/individual' },
  { id: '1.2.2', caption: 'List', level: 3, link: '/pages/customers/reports/list' }
];

const customerMenu: MenuItem[] = [
  { id: '1.1', caption: 'Register', level: 2, link: '/pages/customers/register' },
  { id: '1.2', caption: 'Reports', level: 2, subMenu: customerReportsMenu }
];

const suppliersMenu: MenuItem[] = [
  { id: '2.1', caption: 'Register', level: 2, link: '/pages/suppliers/register' },
  { id: '2.2', caption: 'Reports', level: 2, link: '/pages/suppliers/reports' }
];

export const MenuItems: MenuItem[] = [
  { id: '0', caption: 'Home', level: 1, link: '/'},
  { id: '1', caption: 'Customers', level: 1, subMenu: customerMenu },
  { id: '2', caption: 'Suppliers', level: 1, subMenu: suppliersMenu },
  { id: '3', caption: 'Teste', level: 1, onClick: () => { alert('teste123'); } }
];