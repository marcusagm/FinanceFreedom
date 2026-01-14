import { Upload } from "lucide-react";
import type React from "react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface ImportZoneProps {
    onFileSelect: (file: File) => void;
    disabled?: boolean;
}

export const ImportZone: React.FC<ImportZoneProps> = ({ onFileSelect, disabled = false }) => {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                onFileSelect(acceptedFiles[0]);
            }
        },
        [onFileSelect],
    );

    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
        onDrop,
        accept: {
            "application/x-ofx": [".ofx"],
            "text/plain": [".ofx"],
        },
        maxFiles: 1,
        disabled,
    });

    let borderColorClass = "border-border";
    let bgColorClass = "bg-card";

    if (isDragActive) {
        borderColorClass = "border-primary";
        bgColorClass = "bg-accent/50";
    }
    if (isDragAccept) {
        borderColorClass = "border-emerald-500";
    }
    if (isDragReject) {
        borderColorClass = "border-destructive";
    }

    return (
        <div
            data-testid="import-zone-container"
            {...getRootProps()}
            className={`
                border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
                ${borderColorClass} ${bgColorClass} ${
                    disabled ? "opacity-50 cursor-not-allowed" : ""
                }
            `}
        >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center justify-center">
                <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                {isDragActive ? (
                    <p className="text-lg text-primary font-medium">Drop the OFX file here...</p>
                ) : (
                    <>
                        <p className="text-lg text-foreground font-medium mb-1">
                            Drag & drop an OFX file here
                        </p>
                        <p className="text-sm text-muted-foreground">or click to select file</p>
                    </>
                )}
            </div>
        </div>
    );
};
