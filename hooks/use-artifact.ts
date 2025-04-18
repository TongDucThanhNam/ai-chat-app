"use client";

import useSWR from "swr";
import { UIArtifact } from "@/components/artifact/artifact";
import { useCallback, useMemo, useRef } from "react";

export const initialArtifactData: UIArtifact = {
  documentId: "init",
  content: "",
  kind: "image",
  title: "",
  status: "idle",
  isVisible: false,
  boundingBox: {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  },
};

type Selector<T> = (state: UIArtifact) => T;

export function useArtifactSelector<Selected>(selector: Selector<Selected>) {
  const { data: localArtifact } = useSWR<UIArtifact>("artifact", null, {
    fallbackData: initialArtifactData,
  });

  return useMemo(() => {
    if (!localArtifact) return selector(initialArtifactData);
    return selector(localArtifact);
  }, [localArtifact, selector]);
}

export function useArtifact() {
  const { data: localArtifact, mutate: setLocalArtifact } = useSWR<UIArtifact>(
    "artifact",
    null,
    {
      fallbackData: initialArtifactData,
    },
  );

  // Store previous artifact in a ref to avoid unnecessary rerenders
  const prevArtifactRef = useRef(localArtifact);

  const artifact = useMemo(() => {
    if (!localArtifact) return initialArtifactData;
    // Only update if actually changed
    if (localArtifact === prevArtifactRef.current)
      return prevArtifactRef.current;
    prevArtifactRef.current = localArtifact;
    return localArtifact;
  }, [localArtifact]);

  // Debounced artifact updates
  const updateTimeoutRef = useRef<NodeJS.Timeout>(null);

  const setArtifact = useCallback(
    (updaterFn: UIArtifact | ((currentArtifact: UIArtifact) => UIArtifact)) => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      updateTimeoutRef.current = setTimeout(() => {
        setLocalArtifact((currentArtifact) => {
          const artifactToUpdate = currentArtifact || initialArtifactData;

          if (typeof updaterFn === "function") {
            const newArtifact = updaterFn(artifactToUpdate);
            // Only update if actually changed
            return newArtifact === artifactToUpdate
              ? artifactToUpdate
              : newArtifact;
          }

          return updaterFn === artifactToUpdate ? artifactToUpdate : updaterFn;
        });
      }, 16); // One frame delay for batching updates
    },
    [setLocalArtifact],
  );

  const { data: localArtifactMetadata, mutate: setLocalArtifactMetadata } =
    useSWR<any>(
      () =>
        artifact.documentId ? `artifact-metadata-${artifact.documentId}` : null,
      null,
      {
        fallbackData: null,
      },
    );

  return useMemo(
    () => ({
      artifact,
      setArtifact,
      metadata: localArtifactMetadata,
      setMetadata: setLocalArtifactMetadata,
    }),
    [artifact, setArtifact, localArtifactMetadata, setLocalArtifactMetadata],
  );
}
