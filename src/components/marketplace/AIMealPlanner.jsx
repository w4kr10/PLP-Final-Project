import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { UtensilsCrossed, Sparkles, Plus, ChefHat } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import Chat from '../chat/Chat';

export default function AIMealPlanner() {
  const { user } = useSelector((state) => state.user);
  const { pregnancyRecord } = useSelector((state) => state.pregnancy);
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [preferences, setPreferences] = useState('');
  const [activeTab, setActiveTab] = useState('planner');
  const { toast } = useToast();

  const generateMealPlan = async () => {
    if (!pregnancyRecord?.trimester) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Pregnancy information not found. Please update your profile."
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/ai/meal-plan`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            trimester: pregnancyRecord.trimester,
            dietaryRestrictions: dietaryRestrictions.split(',').map(r => r.trim()).filter(r => r),
            preferences: preferences.split(',').map(p => p.trim()).filter(p => p)
          })
        }
      );

      const data = await response.json();
      if (data.success) {
        setMealPlan(data.data);
        toast({
          title: "Success",
          description: "Your personalized meal plan has been generated!"
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Generate meal plan error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'Failed to generate meal plan'
      });
    } finally {
      setLoading(false);
    }
  };

  const mealDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <ChefHat className="h-8 w-8" />
          AI-Powered Meal Planner
        </h1>
        <p className="text-lg opacity-90">Get personalized nutrition for your pregnancy</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="planner">Meal Plan</TabsTrigger>
          <TabsTrigger value="chat">AI Nutrition Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="planner">
          <div className="space-y-6">
            {/* Configuration Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-orange-500" />
                  Generate Your Meal Plan
                </CardTitle>
                <CardDescription>Customize based on your preferences and restrictions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Dietary Restrictions (comma-separated)
                  </label>
                  <Input
                    placeholder="e.g., gluten-free, dairy-free, vegetarian"
                    value={dietaryRestrictions}
                    onChange={(e) => setDietaryRestrictions(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Food Preferences (comma-separated)
                  </label>
                  <Input
                    placeholder="e.g., protein-rich, iron-rich, calcium-rich"
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Current Trimester:</strong> {pregnancyRecord?.trimester?.charAt(0).toUpperCase() + pregnancyRecord?.trimester?.slice(1)} Trimester
                  </p>
                  <p className="text-sm text-blue-900">
                    <strong>Week:</strong> {pregnancyRecord?.currentWeek}
                  </p>
                </div>

                <Button
                  onClick={generateMealPlan}
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {loading ? 'Generating...' : 'Generate Meal Plan'}
                </Button>
              </CardContent>
            </Card>

            {/* Meal Plan Display */}
            {mealPlan && (
              <div className="space-y-4">
                {/* Summary */}
                {mealPlan.summary && (
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">Meal Plan Summary</h3>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{mealPlan.summary}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Weekly Meal Plan */}
                {mealPlan.weeklyPlan && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <UtensilsCrossed className="h-6 w-6 text-orange-500" />
                      Weekly Meal Plan
                    </h3>
                    {mealPlan.weeklyPlan.map((day, dayIndex) => (
                      <Card key={dayIndex}>
                        <CardHeader>
                          <CardTitle className="text-lg">{mealDays[dayIndex]}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {day.meals && day.meals.map((meal, mealIndex) => (
                            <div key={mealIndex} className="p-3 bg-gray-50 rounded-lg">
                              <p className="font-semibold capitalize text-sm">{meal.type}</p>
                              <p className="text-sm text-gray-700 mt-1">{meal.description}</p>
                              {meal.nutritionalInfo && (
                                <div className="text-xs text-gray-600 mt-2">
                                  <span>Cal: {meal.nutritionalInfo.calories} | </span>
                                  <span>P: {meal.nutritionalInfo.protein}g | </span>
                                  <span>C: {meal.nutritionalInfo.carbs}g | </span>
                                  <span>F: {meal.nutritionalInfo.fat}g</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Nutritional Guidelines */}
                {mealPlan.nutritionalGuidelines && (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-lg">Nutritional Guidelines</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-blue-900 whitespace-pre-wrap">
                        {mealPlan.nutritionalGuidelines}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Tips */}
                {mealPlan.tips && (
                  <Card className="border-purple-200 bg-purple-50">
                    <CardHeader>
                      <CardTitle className="text-lg">Healthy Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-purple-900">
                        {Array.isArray(mealPlan.tips) ? (
                          mealPlan.tips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-lg">✓</span>
                              <span>{tip}</span>
                            </li>
                          ))
                        ) : (
                          <li className="whitespace-pre-wrap">{mealPlan.tips}</li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="chat">
          <Chat 
            roomId={`meal-planner-${user?.id}`}
            isAI={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
