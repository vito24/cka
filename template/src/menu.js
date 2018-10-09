const menus = [
  {
    name: 'dashboard',
    icon: 'dashboard',
    path: 'dashboard'
  },
  {
    name: 'example',
    icon: 'table',
    path: 'example',
    children: [
      {
        name: 'example-1',
        path: 'example-1'
      },
      {
        name: 'example-2',
        path: 'example-2',
        children: [
          {
            name: 'example-2-1',
            path: 'example-2-1'
          },
          {
            name: 'example-2-2',
            path: 'example-2-2'
          }
        ]
      }
    ]
  }
];

function formatMenus(data, parentPath = '/') {
  return data.map(({ path, children, ...rest }) => {
    const formattedPath = `${parentPath}${path}`;
    const formattedItem = {
      ...rest,
      path: formattedPath
    };
    if (children) {
      formattedItem.children = formatMenus(children, `${formattedPath}/`);
    }
    return formattedItem;
  });
}

export default formatMenus(menus);
