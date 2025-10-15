import { useAppSelector } from "@/store/hooks";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { fadeInUp, staggerContainer } from "@lib/animations";
import { motion } from "framer-motion";
import { AlertCircle, Mail, User, UserCircle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-4xl font-bold shadow-lg">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Your Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your account information
          </p>
        </motion.div>

        {/* Profile Information Card */}
        <motion.div variants={fadeInUp}>
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Account Details</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
                <User className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Username
                  </p>
                  <p className="text-lg font-semibold">{user.username}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
                <Mail className="h-5 w-5 text-purple-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Email Address
                  </p>
                  <p className="text-lg font-semibold">{user.email}</p>
                </div>
              </div>

              {(user.first_name || user.last_name) && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
                  <UserCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Full Name
                    </p>
                    <p className="text-lg font-semibold">
                      {[user.first_name, user.last_name]
                        .filter(Boolean)
                        .join(" ")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Feature Notice */}
        <motion.div variants={fadeInUp}>
          <Card className="p-6 border-blue-500/20 bg-blue-500/5">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2">
                  Profile Editing Coming Soon
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We're working on adding profile editing features. Soon you'll
                  be able to update your username, email, and password directly
                  from this page.
                </p>
                <p className="text-sm text-muted-foreground">
                  For now, if you need to make changes to your account, please
                  contact support or check back soon for updates.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div variants={fadeInUp} className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer"
          >
            Go to Dashboard
          </Button>
          <Button
            onClick={() => navigate("/simulator")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer"
          >
            Try Simulator
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
