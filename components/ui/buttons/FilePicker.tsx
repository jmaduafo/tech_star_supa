import React from "react";

type FileProps = {
  readonly title: string;
  readonly inputRef: React.RefObject<HTMLInputElement | null>;
  readonly setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
  readonly setNewImage: React.Dispatch<React.SetStateAction<File | null>>;
};

function FilePicker({ title, inputRef, setImagePreview, setNewImage }: FileProps) {
  return (
    <>
      <button
        type="button"
        className="py-2 px-4 text-sm bg-light70 rounded-lg text-dark85 w-full text-left font-medium"
        onClick={() => inputRef.current?.click()}
      >
        {title}
      </button>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*"
        multiple
        onChange={(e) => {
          if (e.target.files !== null) {
            setNewImage(e.target.files[0])
            setImagePreview(URL.createObjectURL(e.target.files[0]));
          }
        }}
      />
    </>
  );
}

export default FilePicker;
