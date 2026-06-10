function LoadingSpinner({ showLoader }: { showLoader: boolean }) {
  return (
    <div>
      <>
        <div
          className={`fixed inset-0 w-full h-[100dvh] rounded-lg backdrop-blur-sm text-muted-foreground flex flex-col transition-opacity duration-500
             items-center gap-5 justify-center
             ${showLoader ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <span>waking up the meowls</span>
          <span className="w-5 h-5 rounded-full border-2 border-primary/35 border-t-primary animate-spin" />
        </div>
      </>
    </div>
  );
}

export default LoadingSpinner;
