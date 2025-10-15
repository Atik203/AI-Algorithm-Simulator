import { Brain, Github } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Brand Section */}
          <div>
            <Link to="/" className="flex items-center gap-2 group mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                AI Algorithm Simulator
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              A free and open-source platform for visualizing and understanding
              AI search algorithms. Learn, experiment, and master pathfinding
              algorithms through hands-on experience.
            </p>
          </div>

          {/* Links Section */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                to="/simulator"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Simulator
              </Link>
            </div>
            <a
              href="https://github.com/Atik203/AI-Algorithm-Simulator"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
            >
              <Github className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} AI Algorithm Simulator. Free & Open Source.
          </p>
          <p className="text-sm text-muted-foreground">
            Built By{" "}
            <a
              href="https://github.com/Atik203"
              target="_blank"
              className="text-primary"
            >
              Atikur Rahaman
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
