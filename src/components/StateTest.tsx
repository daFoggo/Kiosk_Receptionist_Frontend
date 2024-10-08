import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const StateTestComponent = () => {
  const [webcamData, setWebcamData] = useState({
    nums_of_people: 0,
    person_datas: []
  });
  const [currentRole, setCurrentRole] = useState('');
  const [interactionState, setInteractionState] = useState('IDLE');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState('idle');

  const roles = ['STUDENT', 'STAFF', 'EVENT_GUEST', 'GUEST'];
  
  const handlePeopleCountChange = (count) => {
    setWebcamData(prev => ({
      ...prev,
      nums_of_people: count,
      person_datas: Array(count).fill({ role: currentRole })
    }));
  };

  const handleStartVerification = () => {
    setIsVerifying(true);
    setVerificationStep('verifying');
    setInteractionState('GUEST_VERIFICATION');
  };

  const handleCompleteVerification = () => {
    setIsVerifying(false);
    setVerificationStep('completed');
    setInteractionState('CONTACT_DEPARTMENT');
  };

  const resetAll = () => {
    setWebcamData({ nums_of_people: 0, person_datas: [] });
    setCurrentRole('');
    setInteractionState('IDLE');
    setIsVerifying(false);
    setVerificationStep('idle');
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>State Management Test Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="mb-2 font-semibold">People Count</h3>
              <div className="flex space-x-2">
                {[0, 1, 2, 3].map(count => (
                  <Button 
                    key={count}
                    variant={webcamData.nums_of_people === count ? "default" : "outline"}
                    onClick={() => handlePeopleCountChange(count)}
                  >
                    {count}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="mb-2 font-semibold">Role Selection</h3>
              <Select value={currentRole} onValueChange={setCurrentRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="mb-2 font-semibold">Verification Actions</h3>
              <div className="space-x-2">
                <Button 
                  onClick={handleStartVerification}
                  disabled={isVerifying || webcamData.nums_of_people === 0}
                >
                  Start Verification
                </Button>
                <Button 
                  onClick={handleCompleteVerification}
                  disabled={!isVerifying}
                >
                  Complete Verification
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="mb-2 font-semibold">Reset</h3>
              <Button variant="destructive" onClick={resetAll}>
                Reset All States
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current State</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTitle>Webcam Data</AlertTitle>
            <AlertDescription>
              People Count: {webcamData.nums_of_people}
              <br />
              Roles: {webcamData.person_datas.map(p => p.role).join(', ') || 'None'}
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertTitle>Role & Interaction State</AlertTitle>
            <AlertDescription>
              Current Role: {currentRole || 'None'}
              <br />
              Interaction State: {interactionState}
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertTitle>Verification Status</AlertTitle>
            <AlertDescription className="flex items-center space-x-2">
              <span>
                {isVerifying && <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />}
                Step: {verificationStep}
              </span>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default StateTestComponent;