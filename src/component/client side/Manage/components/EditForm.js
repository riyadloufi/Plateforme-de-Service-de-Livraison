const EditForm = ({ editFormData, setEditFormData, onSave, onCancel, ad }) => {
  // ...
  return (
    <div className={styles.editForm}>
      {[
        { label: 'Titre', type: 'text', field: 'title' },
        { label: 'Description', type: 'textarea', field: 'description' },
        { label: 'Prix (DH)', type: 'number', field: 'price' }
      ].map(({ label, type, field }) => (
        // ...
      ))}
    </div>
  );
}; 