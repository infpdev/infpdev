const About = ({ isMobile }: { isMobile: boolean }) => {
  return (
    <div>
      <section className="space-y-3 transition-transform duration-200 origin-left">
        <h1
          className={`font-medium text-foreground 
                  ${isMobile ? "text-xl ml-2" : "text-2xl"}`}
        >
          hey, i'm dev{" "}
          <span className={`${isMobile ? "text-base" : "text-lg"}`}>
            (as in dave, not developer xd)
          </span>
        </h1>
      </section>

      {/* Main content grid - responsive, both columns in same container */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left column */}
        <div className="space-y-10 flex flex-col">
          {/* About me - brief */}
          <div className="flex text-[15px] flex-col justify-center p-4 rounded-lg bg-background/60 border border-border/50 lg:flex-1">
            <p className="text-muted-foreground leading-relaxed">
              i'm an introverted developer who likes building small, silly
              stuff.
              <br></br> it's usually just for fun, but sometimes they end up
              being useful
              <br></br>
              <br></br>i learn as i build, break stuff, fix, repeat
              <br></br>sometimes i meet people i actually vibe with
              <br></br>
              <br></br> p.s. i post random stuff on youtube sometimes :{">"}
              <br></br>
              also, yes - cats {"<3"}
            </p>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-8 flex flex-col">
          <div className="flex flex-col justify-center p-4 rounded-lg bg-background/60 border border-border/50 lg:flex-1">
            <h3 className="text-[15px] text-muted-foreground tracking-wide mb-3">
              (if you're still here, here's a bit more)
            </h3>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              if i'm online, i'm probably fixing something that annoyed me or
              just looking for a new distraction.
              <br />
              sometimes it works, sometimes it doesn't - i keep it if it's fun.
              <br />
              <br />
              open to collabs, as long as it's not some quantum-computing AI
              startup ;]
              <br />
              <br />
              p.s. i play gtao, pubg, battlefront 2, etc - if you're introverted
              too, we’ll get along fine :]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
