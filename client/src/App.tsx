import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { trackEvent, trackMetaEvent } from "@/lib/analytics";
import Home from "@/pages/Home";
import StartHere from "@/pages/StartHere";
import Learn from "@/pages/Learn";
import LearnArticle from "@/pages/LearnArticle";
import Ask from "@/pages/Ask";
import Community from "@/pages/Community";
import Sell from "@/pages/Sell";
import NotFound from "@/pages/not-found";
import InheritedMineralRights from "@/pages/landing/InheritedMineralRights";
import GotAnOffer from "@/pages/landing/GotAnOffer";
import ValueMyMinerals from "@/pages/landing/ValueMyMinerals";
import ThankYouReview from "@/pages/ThankYouReview";
import ThankYouQuestion from "@/pages/ThankYouQuestion";
import Privacy from "@/pages/legal/Privacy";
import Terms from "@/pages/legal/Terms";
import Disclaimer from "@/pages/legal/Disclaimer";

// Scroll to top + fire a virtual page_view on every route change.
function RouteEffects() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    trackEvent("page_view", { page_path: location });
    trackMetaEvent("PageView");
  }, [location]);
  return null;
}

function AppRouter() {
  return (
    <>
      <RouteEffects />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/start-here" component={StartHere} />
        <Route path="/learn" component={Learn} />
        <Route path="/learn/:slug" component={LearnArticle} />
        <Route path="/ask" component={Ask} />
        <Route path="/community" component={Community} />
        <Route path="/sell" component={Sell} />

        {/* Ad landing pages */}
        <Route path="/inherited-mineral-rights" component={InheritedMineralRights} />
        <Route path="/got-an-offer" component={GotAnOffer} />
        <Route path="/value-my-minerals" component={ValueMyMinerals} />
        <Route path="/value" component={ValueMyMinerals} />

        {/* Thank-you / conversion pages */}
        <Route path="/thank-you/review" component={ThankYouReview} />
        <Route path="/thank-you/question" component={ThankYouQuestion} />

        {/* Legal */}
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/disclaimer" component={Disclaimer} />

        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router hook={useHashLocation}>
          <AppRouter />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
