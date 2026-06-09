import PageHeader from './PageHeader.jsx';

function AdminLayout({ actions, children, description, eyebrow, title }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      <PageHeader actions={actions} description={description} eyebrow={eyebrow} title={title} />
      <div className="mt-6">{children}</div>
    </div>
  );
}

export default AdminLayout;
