

export const  LLMSelector: React.FC<{ selected: string }> = ({ selected }) => {
  return (
    <div className="text-sm text-dark-300">
      Modèle sélectionné: <strong>{selected}</strong>
    </div>
  );
}