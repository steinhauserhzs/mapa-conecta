import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Car, Edit, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const analysisOptions = [
  {
    title: "Análise de Telefones",
    description: "Descubra o significado numerológico de números de telefone",
    icon: Phone,
    href: "/analises/telefone",
    color: "text-blue-600",
  },
  {
    title: "Análise de Endereços",
    description: "Analise a energia numerológica de endereços e CEPs",
    icon: MapPin,
    href: "/analises/endereco",
    color: "text-green-600",
  },
  {
    title: "Análise de Placas",
    description: "Interprete a numerologia de placas de veículos",
    icon: Car,
    href: "/analises/placa",
    color: "text-purple-600",
  },
  {
    title: "Correção de Assinatura",
    description: "Otimize sua assinatura com base na numerologia",
    icon: Edit,
    href: "/analises/assinatura",
    color: "text-orange-600",
  },
];

export default function Analises() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Análises Numerológicas</h1>
        <p className="text-muted-foreground">
          Ferramentas rápidas para análises numerológicas específicas
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {analysisOptions.map((option) => (
          <Card key={option.title} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <option.icon className={`h-6 w-6 ${option.color}`} />
                {option.title}
              </CardTitle>
              <CardDescription>
                {option.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to={option.href}>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Iniciar Análise
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}